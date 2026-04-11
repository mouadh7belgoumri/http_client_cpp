#include <iostream>
#include <webview/webview.h>
#include "../lib/index_html.h"

int main(int, char**){
    webview::webview w(false, nullptr);
    w.set_title("Hello, World!");
    w.set_size(800, 600, WEBVIEW_HINT_NONE);
    w.set_html(html);
    w.set_title("title changed");
    w.run();
    return 0;
}
