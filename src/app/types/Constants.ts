// This file will hold global constant variables

export const constants = {
    MIN_ID_LEN: 5,
    MIN_PWD_LEN: 8,
    PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ILLEGAL_CHAR_REGEX: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
} as const;