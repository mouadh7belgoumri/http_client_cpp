cmake_minimum_required(VERSION 3.10.0)
project(desktop_backend VERSION 0.1.0 LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
include(FetchContent)
find_package(SQLiteCpp CONFIG REQUIRED)
find_package(ada-url)



FetchContent_Declare(
    webview
    GIT_REPOSITORY https://github.com/webview/webview
)
FetchContent_MakeAvailable(webview)

FetchContent_Declare(
    json
    URL https://github.com/nlohmann/json/releases/download/v3.12.0/json.tar.xz
    )
FetchContent_MakeAvailable(json)


add_executable(desktop_backend src/main.cpp)
target_link_libraries(desktop_backend PRIVATE webview::core nlohmann_json::nlohmann_json SQLiteCpp ada )


include(CTest)
enable_testing()

