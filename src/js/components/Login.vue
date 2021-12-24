<template>
  <div class="cont">
    <n-form :label-width="80">
      <n-form-item label="Email" path="user.email">
        <n-input v-model:value="user.email" placeholder="Email" />
      </n-form-item>
      <n-form-item label="Contraseña" path="user.password">
        <n-input
          v-model:value="user.password"
          type="password"
          placeholder="Contraseña"
        />
      </n-form-item>
      <n-form-item>
        <div class="buttons">
          <n-button secondary @click="signin">Entrar</n-button>
          <n-button type="primary" @click="signup">Registrarse</n-button>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { NButton, NForm, NInput, NFormItem } from "naive-ui";

export default {
  name: "Login",
  components: {
    NButton,
    NInput,
    NForm,
    NFormItem,
  },
  data() {
    return {
      formValue: "",
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    signup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$emit("logged", user);
        })
        .catch((error) => {
          window.alert(`Error ${error.code}: ${error.message}`);
        });
    },
    signin() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$emit("logged", user);
        })
        .catch((error) => {
          window.alert(`Error ${error.code}: ${error.message}`);
        });
    },
  },
};
</script>

<style>
.cont {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 200px;
  padding: 40px 40px 40px 40px;
  background: lightslategray;
}

.buttons {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>