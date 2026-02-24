<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">User Management</h2>

    <!-- Search and Add -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
      <InputText
        v-model="globalFilter"
        placeholder="Search users..."
        class="p-inputtext-sm w-full sm:w-64"
      />
      <Button label="Add User" icon="pi pi-plus" class="p-button-sm p-button-primary" @click="addUser" />
    </div>

    <!-- Users Table -->
    <DataTable
      :value="users"
      :paginator="true"
      :rows="10"
      :globalFilter="globalFilter"
      responsiveLayout="scroll"
      class="p-datatable-sm"
      :loading="loading"
    >
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email" sortable></Column>
      <Column field="role" header="Role" sortable></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-sm p-button-text p-button-info mr-2"
            @click="editUser(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-sm p-button-text p-button-danger"
            @click="deleteUser(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import  DataTable  from 'primevue/datatable';
import  Column  from 'primevue/column';
import  Button from 'primevue/button';
import InputText from 'primevue/inputtext';


</script>

<style scoped>
</style>
