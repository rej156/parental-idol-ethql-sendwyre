import { schema88, ObjectErc721 } from "@0xcert/conventions";
import { Cert } from "@0xcert/cert";

const statusConsole: HTMLElement = document.getElementById("statusConsole");
const description: string = "The first Erc721 cryptocollectible by the Parental Idol Shoreditch London brand.";

const data: ObjectErc721 = {
  $evidence: "https://parental-idol.myshopify.com/collections/frontpage/products/i-am-sad-i-have-no-money",
  $schema: "http://json-schema.org/draft-07/schema",
  description,
  image:
    "https://cdn.shopify.com/s/files/1/0047/0564/8714/products/Screen_Shot_2019-02-17_at_01.17.09_1024x1024@2x.png",
  name: "I am sad I have no money",
};

const cert = new Cert({
  schema: schema88,
});

window["certify"] = async () => {
  statusConsole.innerHTML = await cert.imprint(data);
};

window["disclose"] = async () => {
  statusConsole.innerHTML = await cert
    .disclose(data, [["description"], ["image"], ["namex"]])
    .then(d => JSON.stringify(d));
};
