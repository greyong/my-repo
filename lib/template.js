module.exports = {
    HTML:function(title, list, body, control){
        if (title ==='chap3-stack'){
            control += `
                <br>
                <a href="/push">push</a>
                <a href="/pop">pop</a>
                <a href="/peek">peek</a>
                <a href="/clear">clear</a>
            `
        }
        
        return `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
            </body>
            </html>
        `;
    }, 
    list:function(filelist){
        var list = `<ul>`;
        var i=0;
        while(i < filelist.length){
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
        }
        list += `</ul>`;
        return list;
    }
}

