import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: "public_fGYAke1GQbym6AdOZiOuVm63KsE=",
  privateKey: "private_zDunPCXpLBx5RKS/k3nnAPt95L0=",
  urlEndpoint: "https://ik.imagekit.io/greatstackSakhila",
});

export { toFile };
export default imagekit;
