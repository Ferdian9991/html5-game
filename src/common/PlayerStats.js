export default class PlayerStats {
  constructor() {
    this.health = 5;
    this.recentHealth = 5;
    this.maxHealth = 5;
    this.minHealth = 0;
    this.score = 0;

    this.isGameOver = false;
    window.playerStats = this;
  }

  addScore(score) {
    this.score += score;
  }

  reduceHealth() {
    if (this.health > this.minHealth) {
      this.recentHealth = this.health;
      this.health--;
    }
  }

  increaseHealth() {
    if (this.health < this.maxHealth) {
      this.health++;
      this.recentHealth = this.health;
    }
  }

  isDead() {
    return this.health < this.recentHealth;
  }

  isWin() {
    return this.score >= 100;
  }
}
