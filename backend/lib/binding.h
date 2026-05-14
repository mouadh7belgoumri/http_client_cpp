#ifndef BINDING_H
#define BINDING_H
#include <webview/webview.h>

class binding {
    public:
        binding(const binding&) =delete;
        binding operator=(const binding&) =delete;
        binding operator=(binding&&) =delete;
        virtual void operator()(std::string, std::string, void*) =0; 
};


class getRequests : public binding{
    private:
        std::shared_ptr<webview::webview> m_window;
    public:
        getRequests() =delete;
        getRequests(std::shared_ptr<webview::webview> w);
        getRequests(const getRequests&);
        void operator()(std::string, std::string, void*){}
};
#endif