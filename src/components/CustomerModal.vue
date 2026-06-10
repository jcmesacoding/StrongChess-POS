<script setup>
import { ref } from "vue";

const emit =
  defineEmits([
    "close",
    "save"
  ]);

const form = ref({

  firstname: "",
  middlename: "",

  lastname: "",
  surname: "",

  socialReason: "",
  commercialName: "",

  email: "",
  phoneNumber: "",
  documentNumber: "",
  address: ""

});

const save = () => {

  const required = [

    form.value.firstname,
    form.value.lastname,
    form.value.middlename,
    form.value.surname,
    form.value.socialReason,
    form.value.commercialName,
    form.value.email

  ];

  if (
    required.some(
      value =>
        !value ||
        value.trim().length < 3
    )
  ) {

    return;

  }

  emit(
    "save",
    {
      ...form.value
    }
  );

};

</script>

<template>

<div
class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>

<div
class="bg-white rounded-2xl p-6 w-[650px]"
>

<h2
class="text-2xl font-bold mb-5"
>
New Customer
</h2>

<div
class="grid grid-cols-2 gap-4"
>

<input
v-model="form.firstname"
placeholder="First name"
class="border rounded-lg p-3"
/>

<input
v-model="form.middlename"
placeholder="Middle Name"
class="border rounded-lg p-3"
/>

<input
v-model="form.lastname"
placeholder="Last name"
class="border rounded-lg p-3"
/>

<input
v-model="form.surname"
placeholder="Surname"
class="border rounded-lg p-3"
/>

<input
v-model="form.socialReason"
placeholder="Social Reason"
class="border rounded-lg p-3"
/>

<input
v-model="form.commercialName"
placeholder="Commercial Name"
class="border rounded-lg p-3"
/>

<input
v-model="form.email"
placeholder="Email"
class="border rounded-lg p-3"
/>

<input
v-model="form.phoneNumber"
placeholder="Phone"
class="border rounded-lg p-3"
/>

<input
v-model="form.documentNumber"
placeholder="Document"
class="border rounded-lg p-3"
/>

<input
v-model="form.address"
placeholder="Address"
class="border rounded-lg p-3 col-span-2"
/>

</div>

<div
class="flex justify-end gap-3 mt-6"
>

<button
@click="emit('close')"
class="px-4 py-2 border rounded-xl"
>
Cancel
</button>

<button
type="button"
@click="save"
class="px-4 py-2 rounded-xl text-white"
style="background:#213141"
>
Save Customer
</button>

</div>

</div>

</div>

</template>