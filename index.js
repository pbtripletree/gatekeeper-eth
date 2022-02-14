const { SiweMessage } = require("siwe");
const Web3 = require("web3");
const Moralis = require("moralis/node");

const { Request, Response } = require("../models.js");
const { ResponseMessage } = require("../enums.js");

const getOwnedTokens = async (serverUrl, appId, options) => {
  Moralis.start({
    serverUrl,
    appId,
  });
  const tokens = await Moralis.Web3API.account.getNFTs(options);
  return tokens.result.map((token) => token.token_address);
};

const verifyRequest = async (request) => {
  try {
    const siweMessage = new SiweMessage(request.message);
    const validated = await siweMessage.validate(request.signature);
    return validated;
  } catch (e) {
    return null;
  }
};

const authorizeEthereum = async ({
  request,
  tokenRoles,
  serverUrl,
  appId,
  chain,
}) => {
  const req = new Request(request);
  const verified = await verifyRequest(req);
  if (!verified) return new Response(false, ResponseMessage.INVALID_SIGNATURE);
  const { address } = verified;
  const options = {
    chain,
    address,
  };
  const tokens = await getOwnedTokens(serverUrl, appId, options);
  const roles = tokenRoles.filter((tokenRole) =>
    tokenRole.addresses.find((address) => tokens.includes(address))
  );
  if (!roles.length) return new Response(false, ResponseMessage.NO_ROLES);
  return new Response(
    true,
    ResponseMessage.ROLES,
    roles.map((role) => role.role)
  );
};

module.exports = {
  authorizeEthereum,
};
