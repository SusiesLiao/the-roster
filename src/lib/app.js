/* The door into the product.
 *
 * theroster.studio is the agency — where you meet them.
 * my.theroster.studio is your Roster — where they work for you.
 *
 * Two addresses, one customer. Until now the site had no link to the second
 * one at all: conversion was a mailto to a human and a hand-made Telegram
 * invite, and a paying customer had no way back in from the front page.
 *
 * appLink(intent) carries the role across the boundary. The app already knows
 * what to do with it — tapping a seat labelled Hire must hire THAT person, not
 * hand you to Amber first — so a Hire button on this site can point straight at
 * the seat instead of dropping the user at a generic front door.
 */
export const APP_URL = 'https://my.theroster.studio'

export function appLink(intent) {
  return intent ? `${APP_URL}/?hire=${encodeURIComponent(intent)}` : APP_URL
}

/** Returning customers. Same address; the app decides what to show a session. */
export const SIGN_IN = `${APP_URL}/?in=1`
