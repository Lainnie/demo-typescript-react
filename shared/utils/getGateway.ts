const getGateway = (path: string) =>
  `${process.env.GATEWAY_URL}${path}`;

export default getGateway;
