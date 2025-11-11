import 'dotenv/config';
import ISDSBox from '../src/lib/ISDSBox.js';
import DataMessage from '../src/models/DataMessage.js';

// Replace these with actual values
const loginname = process.env.ISDS_LOGINNAME;
const password = process.env.ISDS_PASSWORD;

async function createDataMessage() {
  const isdsBox = new ISDSBox().loginWithUsernameAndPassword(
    loginname,
    password,
    true,
  ); // Set to true for production environment

  console.log('Logged in');
  console.log(isdsBox);

  const ownerInfo = await isdsBox.getOwnerInfoFromLogin();
  console.log(ownerInfo);

  const dataMessageFiles = [
    {
      dmFilePath: '../test/communication_test.pdf',
      dmMimeType: 'application/pdf',
      dmFileMetaType: 'main',
      dmFileDescr: 'file1.pdf',
    },
  ];

  const dataMessage = new DataMessage({
    dmSenderOrgUnit: null, // null
    dmSenderOrgUnitNum: null, // null
    dbIDRecipient: 'kdrgzra', // ID datové schránky příjemce - povinný
    dmRecipientOrgUnit: null, // null
    dmRecipientOrgUnitNum: null, // null
    dmToHands: 'ISS Europe', // textové pole k rukám
    dmAnnotation: 'ISS Test komunikace (ignorovat)', // předmět datové zprávy - povinný
    dmRecipientRefNumber: null, //
    dmSenderRefNumber: null, // null
    dmRecipientIdent: '', // spisová značka vaše
    dmSenderIdent: '', // naše spisová značka
    dmLegalTitleLaw: '', // zmocnění číslo zákona
    dmLegalTitleYear: '', // zmocnění rok
    dmLegalTitleSect: 'f', // zmocnění paragraf
    dmLegalTitlePar: '', // zmocnění odstavec
    dmLegalTitlePoint: '', // zmocnění písmeno
    dmPersonalDelivery: true, // do vlastních rukou
    dmAllowSubstDelivery: true, // dmAllowSubstDelivery true
    dmOVM: true, // není v ZFO
    dmPublishOwnID: false, // není v ZFO
  });

  try {
    const response = await isdsBox.createMessage(dataMessage, dataMessageFiles);
    console.log('Created Message ID:', response.dmID);
    return response.dmID;
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error(error);
  }
}

try {
  const messageId = await createDataMessage();
  console.log(messageId);
} catch (error) {
  console.error('Error:', error);
  console.error(JSON.stringify(error, null, 2));
}
