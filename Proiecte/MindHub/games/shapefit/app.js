let lvl = 1
let pts = 0
let run = false
let correct = null
let waiting = false

let shapes = ["circle", "square", "triangle"]
let colors = ["#ff4d4d", "#4a9eff", "#22c55e", "#fbbf24"]
let rots = [0, 90, 180]
let good = 0

let totalExercises = 6
let playExercises = 3
let exPick = []
let exDone = 0

function pick(a) {
  return a[Math.floor(Math.random() * a.length)]
}

function same(a, b) {
  return a.shape === b.shape && a.color === b.color && a.rot === b.rot
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let t = a[i]
    a[i] = a[j]
    a[j] = t
  }
  return a
}

function setInfo(s) {
  document.getElementById("info").textContent = s
}

function setScore() {
  document.getElementById("current-score").textContent = pts
}

function setLevel() {
  document.getElementById("level").textContent = "Level " + lvl
}

function rulesForLevel(l) {
  if (l === 1) return { count: 3, needColor: false, needRot: false, memory: false, rotSameShapeOnly: false }
  return { count: 3, needColor: true, needRot: false, memory: false, rotSameShapeOnly: false }
}

function svgShape(o, outline) {
  let s = 96
  let stroke = o.color || "#bdbdd7"
  let fill = outline ? "none" : (o.color || "#bdbdd7")
  let sw = outline ? 6 : 0

  if (o.shape === "circle") {
    return `
      <svg width="${s}" height="${s}" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
      </svg>
    `
  }

  if (o.shape === "square") {
    return `
      <svg width="${s}" height="${s}" viewBox="0 0 100 100">
        <g transform="rotate(${o.rot} 50 50)">
          <rect x="22" y="22" width="56" height="56" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
        </g>
      </svg>
    `
  }

  return `
    <svg width="${s}" height="${s}" viewBox="0 0 100 100">
      <g transform="rotate(${o.rot} 50 50)">
        <polygon points="50,18 82,78 18,78" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />
      </g>
    </svg>
  `
}

function makeTarget(r) {
  let o = { shape: pick(shapes), color: null, rot: 0 }
  if (r.needColor) o.color = pick(colors)
  return o
}

function makeWrong(r, t) {
  let tries = 0
  while (tries < 50) {
    let x = { shape: pick(shapes), color: null, rot: 0 }
    if (r.needColor) x.color = pick(colors)
    if (!r.needColor) x.color = null
    if (!same(x, t)) return x
    tries++
  }
  return { shape: pick(shapes), color: null, rot: 0 }
}

function clearTarget() {
  document.getElementById("target").innerHTML = ""
}

function lockOptions(v) {
  let btns = document.querySelectorAll(".opt")
  btns.forEach(b => b.disabled = v)
}

function drawTarget(t, r) {
  let el = document.getElementById("target")
  el.innerHTML = svgShape(t, true)
}

function drawOptions(list) {
  let wrap = document.getElementById("options")
  wrap.innerHTML = ""

  for (let o of list) {
    let b = document.createElement("button")
    b.className = "opt"
    b.innerHTML = svgShape(o, false)
    b.onclick = () => choose(o)
    wrap.appendChild(b)
  }

  if (waiting) lockOptions(true)
}

function updateBestUI() {
  let s = localStorage.getItem("score_shape3")
  if (s) {
    let el = document.querySelector('.game-score[data-game="shape33"]')
    if (el) el.textContent = s
  }
}

function pickExercises() {
  let ids = []
  for (let i = 1; i <= totalExercises; i++) ids.push(i)
  shuffle(ids)
  exPick = ids.slice(0, playExercises)
  exDone = 0
}


function nextStep() {
  exDone++
  if (exDone > playExercises) {
    lvl++
    if (lvl > 2) endGame()
    else {
      pickExercises()
      buildRound()
    }
  } else {
    buildRound()
  }
}


function startGame() {
  run = true
  lvl = 1
  pts = 0
  waiting = false
  correct = null

  setScore()
  setInfo("")
  clearTarget()
  document.getElementById("options").innerHTML = ""
  document.getElementById("start").classList.add("hidden")

  pickExercises()
  buildRound()
}

function endGame() {
  run = false
  clearTarget()
  document.getElementById("options").innerHTML = ""
  setInfo("Game Over! Final Score: " + pts)

  let s = localStorage.getItem("score_shape33")
  if (!s || pts > parseInt(s)) localStorage.setItem("score_shape33", pts)

  updateBestUI()
  document.getElementById("start").classList.remove("hidden")
}

function resetGame() {
  run = false
  lvl = 1
  pts = 0
  good = 0
  waiting = false
  correct = null

  setLevel()
  setScore()
  setInfo("")
  clearTarget()
  document.getElementById("options").innerHTML = ""
  document.getElementById("start").classList.remove("hidden")
  updateBestUI()
}

document.getElementById("start").onclick = startGame
document.getElementById("reset").onclick = resetGame

resetGame()
