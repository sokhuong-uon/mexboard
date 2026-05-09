pub mod commands;

pub use commands::*;

use futures_util::stream::SplitSink;
use std::sync::Arc;
use tokio::net::TcpStream;
use tokio::sync::{Mutex, RwLock};
use tokio_tungstenite::tungstenite::protocol::Message;
use tokio_tungstenite::{MaybeTlsStream, WebSocketStream};

#[derive(Clone)]
pub struct WebSocketState {
    pub write: Arc<Mutex<Option<SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>>>>,

    pub read_handle: Arc<RwLock<Option<tokio::task::JoinHandle<()>>>>,
}

impl WebSocketState {
    pub fn new() -> Self {
        Self {
            write: Arc::new(Mutex::new(None)),
            read_handle: Arc::new(RwLock::new(None)),
        }
    }
}
