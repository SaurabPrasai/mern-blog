const title="Hello World And Nepal&"

const slug=title.split(" ").join("-").toLowerCase().replace(/[^a-zA-z0-9]/g,'-')

console.log(slug);