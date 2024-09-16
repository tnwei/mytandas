import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD } from '$env/static/private';

let pb: PocketBase;

export async function getPocketBase() {
  if (!pb) {
    pb = new PocketBase(PUBLIC_POCKETBASE_URL);
    try {
      await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);
    } catch (error) {
      console.error('Failed to authenticate with PocketBase:', error);
      throw error;
    }
  }
  return pb;
}
