import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

const port: string | number = (config.port as string) || 5000;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
