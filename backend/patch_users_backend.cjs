const fs = require('fs');

const file = 'src/users/users.service.ts';
let code = fs.readFileSync(file, 'utf8');

const pipelineAgg = `
    const [data, total] = await Promise.all([
      this.userModel.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'userId',
            as: 'bookings'
          }
        },
        {
          $project: {
            passwordHash: 0,
            refreshTokenHash: 0,
          }
        },
        {
          $addFields: {
            totalBookings: { $size: '$bookings' },
            servicesTaken: {
              $size: {
                $filter: {
                  input: '$bookings',
                  as: 'booking',
                  cond: { $eq: ['$$booking.status', 'COMPLETED'] }
                }
              }
            }
          }
        },
        {
          $project: {
            bookings: 0 // Hide full array to save bandwidth
          }
        }
      ]),
      this.userModel.countDocuments(filter).exec(),
    ]);
`;

code = code.replace(
  /const \[data, total\] = await Promise\.all\(\[[\s\S]*?\]\);/,
  pipelineAgg.trim()
);

fs.writeFileSync(file, code);
