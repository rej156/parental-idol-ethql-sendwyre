import { MetamaskProvider } from "@0xcert/ethereum-metamask-provider";
import { AssetLedger, AssetLedgerCapability } from "@0xcert/ethereum-asset-ledger";

const statusConsole: HTMLElement = document.getElementById("statusConsole");
const provider = new MetamaskProvider();
let assetLedgerId;

async function enableMetamask() {
  if (!(await provider.isEnabled())) {
    await provider.enable();
  }
}

window["deploy"] = async () => {
  await enableMetamask();
  statusConsole.innerHTML = "Starting deploy of asset ledger.";
  const mutation = await AssetLedger.deploy(provider, {
    name: "I am sad I have no money",
    symbol: "I am sad I have no money",
    uriBase: "https://parental-idol.myshopify.com/assets/",
    schemaId: "0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d", // base asset schemaId
    capabilities: [
      AssetLedgerCapability.TOGGLE_TRANSFERS,
      AssetLedgerCapability.UPDATE_ASSET,
      // AssetLedgerCapability.UPDATE_ASSET_IMPRINT
    ],
  })
    .then(mutation => {
      statusConsole.innerHTML = "Deploying(this may take a while)...";
      return mutation.complete();
    })
    .catch(e => {
      console.log(e);
      statusConsole.innerHTML = "Transaction probably canceled... " + e;
    });

  if (mutation.isCompleted()) {
    assetLedgerId = mutation.receiverId;
    statusConsole.innerHTML = "Succesfully deployed to address: " + assetLedgerId + ".";

    console.log("Succesfully deployed to address: " + assetLedgerId + ".");
  }
};

window["getInfo"] = async () => {
  await enableMetamask();
  if (assetLedgerId === undefined) {
    statusConsole.innerHTML = "First deploy asset ledger.";
  } else {
    const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
    statusConsole.innerHTML = await assetLedger.getInfo().then(d => JSON.stringify(d));
  }
};

window["create"] = async () => {
  await enableMetamask();
  if (assetLedgerId === undefined) {
    statusConsole.innerHTML = "First deploy asset ledger.";
  } else {
    statusConsole.innerHTML = "Starting new asset creation.";
    const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
    const mutation = await assetLedger
      .createAsset({
        id: "1",
        imprint: "9a2a092387b2eed18744b08efe6d22c0fb2fa2ab7156969769ca7e701b96043f",
        receiverId: provider.accountId,
      })
      .then(mutation => {
        statusConsole.innerHTML = "Creating new asset(this may take a while)...";
        return mutation.complete();
      })
      .catch(e => {
        statusConsole.innerHTML = "Error: " + e;
      });

    if (mutation.isCompleted()) {
      statusConsole.innerHTML = "Asset succesfully created.";
    }
  }
};

window["transfer"] = async () => {
  await enableMetamask();
  if (assetLedgerId === undefined) {
    statusConsole.innerHTML = "First deploy asset ledger and create an asset.";
  } else {
    statusConsole.innerHTML = "Starting asset transfer.";
    const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
    const mutation = await assetLedger
      .transferAsset({
        receiverId: provider.accountId, // input the address to which you want to transfer, currently you are transfering to yourself
        id: "1",
      })
      .then(mutation => {
        statusConsole.innerHTML = "Transfering asset(this may take a while)...";
        return mutation.complete();
      })
      .catch(e => {
        statusConsole.innerHTML = "Asset transfer error. Did you create an asset? " + e;
      });

    if (mutation.isCompleted()) {
      statusConsole.innerHTML = "Asset succesfully transfered.";
    }
  }
};

window["getAssetOwner"] = async () => {
  await enableMetamask();
  if (assetLedgerId === undefined) {
    statusConsole.innerHTML = "First deploy asset ledger.";
  } else {
    const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
    statusConsole.innerHTML = JSON.stringify(await assetLedger.getAsset("1"), 2);
  }
};
