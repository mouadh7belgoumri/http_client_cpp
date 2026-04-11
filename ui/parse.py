#!/usr/bin/python
file = open('./dist/index.html', 'r')
html = file.read()
parsed_html_string = html.replace('\n', '').replace('  ', '')
cpp_string = 'const char* html = R"(' + parsed_html_string + ')";'
header_file = open('../backend/lib/index_html.h', 'w')
header_file.write(cpp_string)
header_file.close()
file.close()
