from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import subprocess

class RequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/check_plugins':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            url = data['url']
            plugins = data['plugins']
            
            cmd = ['python', 'plugin_checker.py', url] + plugins
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(result.stdout.encode())
        else:
            super().do_GET()

if __name__ == "__main__":
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, RequestHandler)
    print("Server running on port 8000")
    httpd.serve_forever()