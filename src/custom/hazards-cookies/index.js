import {getProvider} from "../../shared/utils";
import {Contract} from "@ethersproject/contracts";
import {Interface} from "@ethersproject/abi";

export const fetchCollection = async (_chainId, { contract, tokenId }) => {
  return {
    id: contract.toLowerCase(),
    slug: "hazards-cookies",
    name: `Hazards Cookies`,
    metadata: {
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmY4ZGMwIiB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTM1MCA1NjBjLTc1Ljk0OSAwLTE0Ny4wMi0yOS43MjctMjAwLjE1LTgzLjc2Ni01Mi43MTEtNTMuNTk4LTgxLjA1OS0xMjQuNDQtNzkuODI0LTE5OS40OCAwLjA5Mzc1LTUuNTA3OCAyLjE0ODQtMTAuODI4IDUuNzg1Mi0xNC45OCAzLjEyNS0zLjU3MDMgNy40NDE0LTYuMzQ3NyAxMi4wMzktNy41MTE3IDIwLjY0OC01LjIwMzEgMzguMTAyLTE5LjEzMyA0Ny45NDktMzguMjE5IDUuNDM3NS0xMC41NDcgMTcuOTIyLTE1LjMyOCAyOS4wMjctMTEuMTI5IDUxLjUyIDE5LjU1NSAxMDAuNjEtMTkuNzYyIDEwMC42MS02OS4zMDFsLTAuNDQxNDEtNC4xNTIzLTAuNTExNzItMy44OTg0Yy0wLjY5OTIyLTYuNDQxNCAxLjMyODEtMTIuODc5IDUuNTc4MS0xNy43ODEgNC4yNDYxLTQuODc1IDEwLjMzNi03Ljc5MyAxNi44MjQtOC4wMjczIDMzLjQzOC0xLjE0NDUgNjIuMTM3LTI0LjU0NyA2OS43ODktNTYuOTEgNS45MDIzLTI0Ljk0MSAzMS41Ny00MC4zMiA1Ny4yNjItMzQuNDE4IDEyNy4yMSAyOS41ODYgMjE2LjA3IDE0MS4wMyAyMTYuMDcgMjcxLjAyIDAgMTUzLjYtMTI1LjYgMjc4LjU1LTI4MCAyNzguNTV6bS0yMzMuMDMtMjY2LjQyYzIuODk0NSA1Ni40MjIgMjYuMDM5IDEwOS4xOCA2Ni4xNDggMTQ5Ljk0IDQ0LjI4NSA0NS4wMzUgMTAzLjU1IDY5LjgxMiAxNjYuODggNjkuODEyIDEyOC42NiAwIDIzMy4zMy0xMDQuMDIgMjMzLjMzLTIzMS44OSAwLTEwOC4xNy03NC4wMTItMjAwLjkyLTE3OS45Ny0yMjUuNTZsLTEuNTYyNSAwLjMwNDY5Yy0xMC40MDYgNDQuNTY2LTQ2LjAxMiA3OC45MTQtOTAuMDkgODkuMTMzLTQuOTY4OCA2Mi4yNTQtNTcuMTkxIDExMS4zNS0xMjAuNjYgMTExLjM1LTguMDAzOSAwLTE2LjA1NS0wLjg2MzI4LTI0LjEwMi0yLjU2NjQtMTIuODc5IDE3LjM4My0zMC4xNDggMzEuMDEyLTQ5Ljk4IDM5LjQ4eiIvPjxwYXRoIGQ9Im00NDMuMzMgMTk4LjMzYzAgMTkuMzMyLTE1LjY2OCAzNS0zNSAzNS0xOS4zMjggMC0zNS0xNS42NjgtMzUtMzUgMC0xOS4zMjggMTUuNjcyLTM1IDM1LTM1IDE5LjMzMiAwIDM1IDE1LjY3MiAzNSAzNSIvPjxwYXRoIGQ9Im0yODAgMzM4LjMzYzAgMTkuMzMyLTE1LjY3MiAzNS0zNSAzNXMtMzUtMTUuNjY4LTM1LTM1YzAtMTkuMzI4IDE1LjY3Mi0zNSAzNS0zNXMzNSAxNS42NzIgMzUgMzUiLz48cGF0aCBkPSJtNDY2LjY3IDM4NWMwIDE5LjMyOC0xNS42NzIgMzUtMzUgMzUtMTkuMzMyIDAtMzUtMTUuNjcyLTM1LTM1czE1LjY2OC0zNSAzNS0zNWMxOS4zMjggMCAzNSAxNS42NzIgMzUgMzUiLz48cGF0aCBkPSJtMzczLjMzIDI4MGMwIDEyLjg4Ny0xMC40NDUgMjMuMzMyLTIzLjMzMiAyMy4zMzJzLTIzLjMzMi0xMC40NDUtMjMuMzMyLTIzLjMzMiAxMC40NDUtMjMuMzMyIDIzLjMzMi0yMy4zMzIgMjMuMzMyIDEwLjQ0NSAyMy4zMzIgMjMuMzMyIi8+PHBhdGggZD0ibTMyNi42NyA0MjBjMCAxMi44ODctMTAuNDQ5IDIzLjMzMi0yMy4zMzYgMjMuMzMycy0yMy4zMzItMTAuNDQ1LTIzLjMzMi0yMy4zMzIgMTAuNDQ1LTIzLjMzMiAyMy4zMzItMjMuMzMyIDIzLjMzNiAxMC40NDUgMjMuMzM2IDIzLjMzMiIvPjxwYXRoIGQ9Im0zMDMuMzMgMjMuMzMyYzAgMTIuODg3LTEwLjQ0NSAyMy4zMzYtMjMuMzMyIDIzLjMzNnMtMjMuMzMyLTEwLjQ0OS0yMy4zMzItMjMuMzM2IDEwLjQ0NS0yMy4zMzIgMjMuMzMyLTIzLjMzMiAyMy4zMzIgMTAuNDQ1IDIzLjMzMiAyMy4zMzIiLz48cGF0aCBkPSJtMjEwIDEyOC4zM2MwIDE5LjMzMi0xNS42NzIgMzUtMzUgMzVzLTM1LTE1LjY2OC0zNS0zNWMwLTE5LjMyOCAxNS42NzItMzUgMzUtMzVzMzUgMTUuNjcyIDM1IDM1Ii8+PHBhdGggZD0ibTUxMy4zMyAyODBjMCAxMi44ODctMTAuNDQ1IDIzLjMzMi0yMy4zMzIgMjMuMzMycy0yMy4zMzItMTAuNDQ1LTIzLjMzMi0yMy4zMzIgMTAuNDQ1LTIzLjMzMiAyMy4zMzItMjMuMzMyIDIzLjMzMiAxMC40NDUgMjMuMzMyIDIzLjMzMiIvPjwvZz48L3N2Zz4=',
      description: 'Hazards Cookies, Yumm!',
      externalUrl: null,
    },
    contract,
    tokenIdRange: null,
    tokenSetId: null,
  };
};

export const fetchToken = async (chainId, { contract, tokenId }) => {
  const provider = getProvider(chainId);

  const nft = new Contract(
    contract,
    new Interface(["function tokenURI(uint256 tokenId) view returns (string)"]),
    provider
  );

  const tokenUri = await nft.tokenURI(tokenId);
  const json = Buffer.from(tokenUri.substring(29), "base64").toString();
  const metadata = JSON.parse(json);

  return {
    contract,
    tokenId,
    collection: contract.toLowerCase(),
    name: metadata.name,
    imageUrl: metadata.image,
    mediaUrl: null,
    flagged: false,
    attributes: [],
  };
};
