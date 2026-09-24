const code = `<input \n type="email" \n className="w-full border-2 border-gray-200 p-3 rounded-lg" \n />`;
console.log(code.match(/<input([^>]*?)className="([^"]*?border-gray-200[^"]*?)"/g));
