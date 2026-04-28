import sys
content = open('c:/Users/mouadh/work/projects/http_client_cpp/backend/lib/index_html.h', 'r', encoding='utf-8').read()
if content.startswith('const char* html = R\"('):
    content = content[len('const char* html = R\"('):-3] # assumes ')\";'
    bytes_arr = content.encode('utf-8')
    with open('c:/Users/mouadh/work/projects/http_client_cpp/backend/lib/index_html.h', 'w', encoding='utf-8') as f:
        f.write('const char html[] = {')
        f.write(', '.join(str(b) for b in bytes_arr) + ', 0')
        f.write('};\n')
