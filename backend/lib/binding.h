#ifndef BINDING_H
#define BINDING_H
#include <webview/webview.h>
class binding
{
private:
    std::shared_ptr<webview::webview> m_window;
public:
    binding() =delete;
    binding(const binding&) =delete;
    binding(binding&&) =delete;
    binding(std::shared_ptr<webview::webview> w);
    ~binding(){};
    binding operator=(const binding&) =delete;
    binding operator=(binding&&) =delete;
    binding operator()(std::string, std::string, void*);
};

class getRequests : public binding{
    getRequests() =delete;
    getRequests(const getRequests&) =delete;
    getRequests(getRequests&&) =delete;
    getRequests(std::shared_ptr<webview::webview>);

};

#endif