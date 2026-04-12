#include <iostream>
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>



using json = nlohmann::json;

int main(int, char**){
    webview::webview w(false, nullptr);
    w.set_title("http_client_cpp");
    w.set_size(1200, 900, WEBVIEW_HINT_NONE);
    w.set_html( html);
    w.run();
    

    
    return 0;
}
    

