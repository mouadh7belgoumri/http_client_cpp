#ifndef BINDING_H
#define BINDING_H
#include <webview/webview.h>
class binding
{
private:
    std::shared_ptr<webview::webview> m_window;
public:
    binding() =delete;
    binding(webview::webview);
    ~binding();
    binding operator=(binding) =delete;
    binding operator()(std::string, std::string, void*)
};



#endif