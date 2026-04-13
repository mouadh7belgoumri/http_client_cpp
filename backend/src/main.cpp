#include <iostream>
#include "../lib/httplib.h"
#include <webview/webview.h>
#include "../lib/index_html.h"
#include <nlohmann/json.hpp>
#include <thread>
#include <SQLiteCpp/SQLiteCpp.h>
#include <fstream>

void say_hello()
{
    std::cout << "Hello, World!" << std::endl;
}
void spinup_srv()
{
    httplib::Server svr;

    svr.Get("/hello", [](const httplib::Request &, httplib::Response &res) {
        res.set_content("Hello World!", "text/plain");
    });

    std::cout << "Server is running on http://0.0.0.0:8080" << std::endl;
    std::cout << "Press Ctrl+C to stop the server." << std::endl;
    std::cout << "this server runs on a seperate thread, so the webview can run concurrently" << std::endl;
    svr.listen("0.0.0.0", 8080);   
}

using json = nlohmann::json;

int main(int, char **)
{

    std::thread t(say_hello);
    std::thread lsrv(spinup_srv);
    webview::webview w(true, nullptr);
    w.set_title("http_client_cpp");
    w.set_size(1200, 900, WEBVIEW_HINT_NONE);
    w.set_html(html);
    w.bind("makeFile", [&](std::string arg) ->std::string {
        json j = json::parse(arg);
        std::cout << "hello from cpp, arg: " << std::endl;
        std::cout << arg << std::endl;
        return "good! it worked!";
    });
    
    w.run();
    t.join();
    lsrv.join();
    return 0;
}
