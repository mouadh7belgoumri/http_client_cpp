#ifndef WINDOW_H
#define WINDOW_H
#include <webview/webview.h>
class window
{
private:
    std::shared_ptr<webview::webview> w;
public:
    window(bool, void*);
    ~window();
    window()=delete;
    
};


#endif