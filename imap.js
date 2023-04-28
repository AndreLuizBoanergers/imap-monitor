let Imap = requeire('node-imap');
let inspect = require('util').inspect;


const config = {
	user: `${user}`
	password: `${pass}`,
	host: `${host}`,
	port: 993,
	tls: true
}
let imap = new Imap(config);

function openInbox(cb){
	imap.openBox('INBOX', true, cb);
}

imap.once('ready', function(){
	openInbox(function(err,box){
		if(err) throw err;
		let f = imap.seq.fetch('1:3',{ 
			bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATA)',
		struct: true});
		f.on('Message',function(msg, seqno){
			console.log('Message #%d', seqno);
			let prefix = `(# ${seqno} ) `;
			msg.on('body', function(stream, info){
				/*if(info.which === 'TEXT'){
					console.log(`${prefix} Body [%s] found, %d total bytes`, inspect(info.which),info.size);
				}*/
				console.log(`${prefix} Attributes: %s`, inspect(attrs, false, 8));
				let buffer = '';
				strean.on('data', function(chunk){
					count += chunk.length;
					buffer += chunk.toString('utf8');
						//if(info.which === 'TEXT'){console.log(`${prefix} Body [%s] found, %d total bytes`, inspect(info.which),info.size);}
				});
				strean.once('end', function(){
					/*if(info.which === 'TEXT'){
						console.log(`${prefix} Body [%s]  (%d/$d)`, inspect(info.which), count, info.size);
					}else{
                       console.log(`${prefix} Body [%s] Finished`, inspect(info.which));
					}*/
					console.log(`${prefix} Finished`);
				});
			});

			msg.once('atributes',function(attrs){
                console.log(`${prefix} Attributes: %s`, inspect(attrs, false, 8));
			});

			msg.once('end',function(err){
				console.log(`Fetch error: ${err}`)
			})
			f.once('end',function(){
				console.log("Done fetching all messages!");
				imap.end()
			})
		});
	});
});


imap.once('error',function(err){
	console.log(err);
});
imap.once('end',function(){
	console.log('Connection ended');
});

imap.connect();
