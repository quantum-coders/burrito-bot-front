<!-- components/Connect.vue -->
<template>
  <div class="connect-page d-flex align-items-center justify-content-center">
    <div class="text-center connect-message">
      <div class="hero-icon mb-4">
        <Icon
          name="ph:wallet-bold"
          size="48"
          class="text-primary animate__animated animate__pulse animate__infinite"
        />
      </div>

      <h1 class="display-5 fw-bold mb-3">Connect Your Wallet</h1>
      <p class="lead text-muted mb-4">
        Please connect your wallet using the button in the top right corner<br>
        to access the BurritoAI platform
      </p>

      <div class="arrow-indicator">
        <Icon
          name="ph:arrow-up-right-bold"
          size="32"
          class="text-primary animate__animated animate__bounce animate__infinite"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.connect-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.connect-message {
  max-width: 600px;
  padding: 2rem;
}

.hero-icon {
  display: inline-flex;
  padding: 1.5rem;
  border-radius: 50%;
  background: rgba(var(--bs-primary-rgb), 0.1);
}

.arrow-indicator {
  position: fixed;
  top: 2rem;
  right: 8rem;
}

@media (max-width: 768px) {
  .connect-page {
    padding: 1rem;
    min-height: calc(100vh - 60px);
  }

  .arrow-indicator {
    display: none;
  }
}
</style>
