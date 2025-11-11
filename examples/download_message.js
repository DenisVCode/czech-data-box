import 'dotenv/config';
import ISDSBox from '../src/lib/ISDSBox.js';
import fs from 'fs';
import path from 'path';

const loginname = process.env.ISDS_LOGINNAME;
const password = process.env.ISDS_PASSWORD;

async function downloadMessage(messageId) {
  const isdsBox = new ISDSBox().loginWithUsernameAndPassword(
    loginname,
    password,
    true, // Set to true for production environment
  );

  console.log('Logged in');

  try {
    const message = await isdsBox.downloadMessage(messageId);
    console.log('Downloaded Message:', message);

    const attachmentsDir = path.join(process.cwd(), 'attachments', messageId);
    await fs.promises.mkdir(attachmentsDir, { recursive: true });

    if (
      message.dmReturnedMessage &&
      message.dmReturnedMessage.dmDm.dmFiles.dmFile
    ) {
      const files = Array.isArray(message.dmReturnedMessage.dmDm.dmFiles.dmFile)
        ? message.dmReturnedMessage.dmDm.dmFiles.dmFile
        : [message.dmReturnedMessage.dmDm.dmFiles.dmFile];

      for (const file of files) {
        const filePath = path.join(attachmentsDir, file.attributes.dmFileDescr);
        const fileContent = Buffer.from(file.dmEncodedContent, 'base64');
        await fs.promises.writeFile(filePath, fileContent);
        console.log(`Saved attachment to ${filePath}`);
      }
    }

    return message;
  } catch (error) {
    console.error('Error downloading message:', error);
    throw new Error(error);
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node examples/download_message.js <messageId>');
    process.exit(1);
  }

  const messageId = process.argv[2];

  try {
    await downloadMessage(messageId);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();


