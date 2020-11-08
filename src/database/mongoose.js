const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/task-app',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log('Connected');
  },
);
