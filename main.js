var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var stack = require('./lib/stack');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;

    console.log('pathname = '+pathname);

    if(pathname === '/') {
        if(queryData.id === undefined){
            fs.readdir('./data',function(error, filelist){
                //console.log(filelist);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(filelist);
                var html = template.HTML(title, list, `<h2>${title}</h2>
                    <p>${description}<p>`,
                    `<a href="/create">create</a>`
                    );
                response.writeHead(200);
                response.end(html);
            });
        } else{
            fs.readdir('./data',function(error, filelist){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){

                    var sanitizedDesc = sanitizeHtml(description).split(',');
                    //console.log(sanitizedDesc);
                    
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, 
                        `<h2>${title}</h2>
                        <p>${sanitizedDesc}<p>`,
                        
                        `<a href="/create">create</a>
                         <a href="/update?id=${title}">update</a> 
                         <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>
                         `
                        );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }else if(pathname === '/create'){
        fs.readdir('./data',function(error, filelist){
            //console.log(filelist);
            var title = 'WEB - create';
            //var description = 'Hello, Node.js';
            var list = template.list(filelist);
            var html = template.HTML(title, list, `
                <form action="/process_create" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        });
    }else if(pathname === '/process_create'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`data/${title}`,description, 'utf8', function(err){
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end('success');
            });
            
        });
    }else if(pathname === '/update'){
        fs.readdir('./data',function(error, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                
                var list = template.list(filelist);
                var html = template.HTML(title, list, `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                    );
                response.writeHead(200);
                response.end(html);
            });
        });
    }else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            //console.log(post);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            //fs.unlinkSync(`data/${id}`);

            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`,description, 'utf8', function(err){
                    response.writeHead(302,{Location: `/?id=${title}`});
                    response.end('success');
                });
            });
        });
    }else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302,{Location: `/`});
                response.end('success');
            });
        });
    }else if(pathname === '/push'){
        fs.readdir('./data',function(error, filelist){
            //var filteredId = path.parse(queryData.id).base;
            var filteredId = 'chap3-stack';
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                
                var list = template.list(filelist);
                var html = template.HTML(title, list, `
                    <form action="/push_process" method="post">
                        <input type="hidden" name="id" value="${filteredId}">
                        <input type="hidden" name="description" value="${description}">
                        <h2>${filteredId}</h2>
                        <p>${description}</p>
                        <p><input type="text" name="element" placeholder="element" value=""></p>
                        <p><input type="submit"></p>
                    </form>
                    `,
                    ''
                    );
                response.writeHead(200);
                response.end(html);
            });
        });
    }else if(pathname === '/push_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.id;
            var element = post.element;
            var description = post.description;
            console.log(post);
            stack.init(description);
            stack.push(element);
            var result = stack.toStr();

            fs.writeFile(`data/${title}`,result, 'utf8', function(err){
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end('success');
            });
        });
    }else if(pathname === '/pop'){
        var title = 'chap3-stack';
        
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
            stack.init(description);
            console.log('pop => '+stack.pop());
            var result = stack.toStr();
            fs.writeFile(`data/${title}`,result, 'utf8', function(err){
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end('success');
            });
        });
    }else if(pathname === '/peek'){
        var title = 'chap3-stack';
        
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
            stack.init(description);
            console.log('peek => '+stack.peek());            
            response.writeHead(302,{Location: `/?id=${title}`});
            response.end('success');
        });
    }else if(pathname === '/clear'){
        var title = 'chap3-stack';
        
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
            //stack.init(description);
            //console.log('pop => '+stack.pop());
            var result = stack.toStr();
            fs.writeFile(`data/${title}`,result, 'utf8', function(err){
                response.writeHead(302,{Location: `/?id=${title}`});
                response.end('success');
            });
        });
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);