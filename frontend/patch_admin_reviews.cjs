const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin/Reviews.jsx', 'utf8');

code = code.replace(
  '<th className="py-3 px-4">Rating</th>',
  '<th className="py-3 px-4">Rating</th>\n                <th className="py-3 px-4 w-1/3">Comment</th>'
);

code = code.replace(
  '<td className="py-3 px-4 text-yellow-500 font-bold">{review.rating} / 5</td>',
  '<td className="py-3 px-4 text-yellow-500 font-bold">{review.rating} / 5</td>\n                  <td className="py-3 px-4 text-sm text-slate-700 italic">"{review.comment}"</td>'
);

fs.writeFileSync('src/pages/Admin/Reviews.jsx', code);
