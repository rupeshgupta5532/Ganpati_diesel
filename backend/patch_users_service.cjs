const fs = require('fs');
const file = 'src/users/users.service.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace aggregation
const oldAgg = `      this.userModel.aggregate([
        { $match: filter },`;
const newAgg = `      this.userModel.aggregate([
        { $unionWith: { coll: 'admins' } },
        { $match: filter },`;
code = code.replace(oldAgg, newAgg);

// Replace countDocuments
const oldCount = `this.userModel.countDocuments(filter).exec(),`;
const newCount = `this.userModel.aggregate([
        { $unionWith: { coll: 'admins' } },
        { $match: filter },
        { $count: 'total' }
      ]),`;
code = code.replace(oldCount, newCount);

// Because the count results in [{total: N}], we need to extract it
const oldTotal = `const [data, total] = await Promise.all([`;
const newTotal = `const [data, totalAgg] = await Promise.all([`;
code = code.replace(oldTotal, newTotal);

const oldMeta = `      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },`;
const newMeta = `      meta: {
        page,
        limit,
        total: totalAgg[0]?.total || 0,
        totalPages: Math.ceil((totalAgg[0]?.total || 0) / limit),
      },`;
code = code.replace(oldMeta, newMeta);

fs.writeFileSync(file, code);
