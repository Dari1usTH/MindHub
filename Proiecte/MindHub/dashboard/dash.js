let user = localStorage.getItem("user")

if (!user) {
  localStorage.setItem("user", "guest")
}