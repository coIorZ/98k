const NAMESPACE_SEP = '/';

export const identify = value => value;

export const prefixType = (type, namespace) => `${namespace}${NAMESPACE_SEP}${type}`;

export const noop = function() {};
