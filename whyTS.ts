type User = {
  name: string;
  address: {
    city: string;
    uf: string;
  }
}

function showUser(user: User) {
  return `Welcome ${user.name} (${user.address.city} - ${user.address.uf})`;
}

