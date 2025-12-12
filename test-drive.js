const { google } = require('googleapis');
require('dotenv').config();

async function testDrive() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  console.log('\n🔍 Testing 2016.001 folder access...\n');

  // List all folders in root
  console.log('Step 1: Listing folders in root...');
  const allFolders = await drive.files.list({
    q: `'${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 10
  });
  console.log('Found:', allFolders.data.files.map(f => f.name).join(', '));

  // Find 2016 folder
  const yearFolder = allFolders.data.files.find(f => f.name === '2016');
  if (!yearFolder) {
    console.log('\n❌ 2016 folder not found!');
    return;
  }
  console.log('\n✓ Found 2016 folder');

  // List all folders in 2016
  console.log('\nStep 2: Listing folders in 2016...');
  const accessionFolders = await drive.files.list({
    q: `'${yearFolder.id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 10
  });
  console.log('Found:', accessionFolders.data.files.map(f => f.name).join(', '));

  // Find 2016.001
  const accessionFolder = accessionFolders.data.files.find(f => f.name === '2016.001');
  if (!accessionFolder) {
    console.log('\n❌ 2016.001 folder not found!');
    return;
  }
  console.log('\n✓ Found 2016.001 folder');

  // List files in 2016.001
  console.log('\nStep 3: Listing files in 2016.001...');
  const files = await drive.files.list({
    q: `'${accessionFolder.id}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 20
  });
  
  if (files.data.files.length === 0) {
    console.log('❌ No files found!');
  } else {
    console.log(`✓ Found ${files.data.files.length} file(s):`);
    files.data.files.forEach(f => {
      console.log(`   - ${f.name} (${f.mimeType})`);
      console.log(`     URL: https://drive.google.com/uc?export=view&id=${f.id}`);
    });
  }
}

testDrive().catch(console.error);
