use std::fs;

use actix_web::{App, HttpResponse, HttpServer, Responder, get, web};
use local_ip_address::local_ip;
use mdns_sd::{ServiceDaemon, ServiceInfo};


fn configure_mdns() {
    // Get local LAN IP
    let ip = local_ip().unwrap();
    // mDNS daemon
    let mdns = ServiceDaemon::new().expect("Failed to create mDNS daemon");
    // Service type
    let service_type = "_http._tcp.local.";
    // Instance name
    let instance_name = "me-daily";
    // Hostname
    let host_name = "me-daily.local.";

    // Advertise service
    let service_info = ServiceInfo::new(
        service_type,
        instance_name,
        host_name,
        ip.to_string(),
        8000,
        None,
    )
    .unwrap();
    let service_info = service_info.enable_addr_auto();

    mdns.register(service_info)
        .expect("Failed to register mDNS service");

    println!("Open on phone:");
    println!("http://me-daily.local:8000");
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    configure_mdns();

    HttpServer::new(|| {
        App::new()
            .service(static_handler)
            .route("/", web::get().to(landing))
    })
    .workers(3)
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}

macro_rules! static_path_prepend {
    ($x:expr) => {
        concat!(
            env!("CARGO_MANIFEST_DIR"),
            concat!(
                "/static/", $x
            )
        )
    };
}

use std::path::PathBuf;
#[get("/static/{path:.*}")]
async fn static_handler(path: web::Path<String>) -> HttpResponse {
    let file_path = PathBuf::from(static_path_prepend!("")).join(path.into_inner());

    let bytes = std::fs::read(&file_path).unwrap();

    let mime = mime_guess::from_path(&file_path)
        .first_or_octet_stream();

    HttpResponse::Ok()
        .content_type(mime.as_ref())
        .body(bytes)
}

async fn landing() -> impl Responder {
    match fs::read_to_string(static_path_prepend!("landing/landing.html")) {
        Ok(html) => HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(html),

        Err(err) => {
            eprintln!("Failed to read static: {err}");

            HttpResponse::InternalServerError()
                .body("Failed to load page")
        }
    }
}
