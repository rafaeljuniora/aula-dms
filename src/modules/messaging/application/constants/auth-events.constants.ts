export const AUTH_EXCHANGES = {
  created: "auth.created.exchange",
  updated: "auth.updated.exchange",
  deleted: "auth.deleted.exchange",
} as const;

export const AUTH_ROUTING_KEYS = {
  created: "user.created",
  updated: "user.updated",
  deleted: "user.deleted",
} as const;

export const AUTH_QUEUES = {
  created: "academic-teachers.auth.created.queue",
  updated: "academic-teachers.auth.updated.queue",
  deleted: "academic-teachers.auth.deleted.queue",
} as const;
