<script setup lang="ts">
import { ref, markRaw } from 'vue'
import type { Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  CalendarDays,
  Scissors,
  PawPrint,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Menu,
  LayoutDashboard,
  ClipboardList,
} from 'lucide-vue-next'
import { useAuthStore } from '@/modules/auth/store/useAuthStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(true)

interface MenuItem {
  label: string
  icon: Component
  to?: string
  children?: { label: string; to: string }[]
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: markRaw(LayoutDashboard), to: '/dashboard' },
  { label: 'Mascotas', icon: markRaw(PawPrint), to: '/pets' },
  { label: 'Agenda de Citas', icon: markRaw(CalendarDays), to: '/appointments' },
  {
    label: 'Servicios Caninos',
    icon: markRaw(Scissors),
    children: [
      { label: 'Salud', to: '/services?category=Health' },
      { label: 'Estética', to: '/services?category=Aesthetics' },
      { label: 'Nutrición', to: '/services?category=Nutrition' },
      { label: 'Guardería', to: '/services?category=Daycare' },
      { label: 'Funeraria', to: '/services?category=Funeral' },
    ],
  },
  { label: 'Historias Clínicas', icon: markRaw(ClipboardList), to: '/medical-records' },
]

const expandedItems = ref<string[]>([])

function toggleExpand(label: string) {
  const idx = expandedItems.value.indexOf(label)
  if (idx >= 0) {
    expandedItems.value.splice(idx, 1)
  } else {
    expandedItems.value.push(label)
  }
}

function isExpanded(label: string) {
  return expandedItems.value.includes(label)
}

function isActive(to?: string) {
  return to ? route.path.startsWith(to) : false
}

async function logout() {
  authStore._logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ─── Sidebar ─────────────────────────────────────────── -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      :width="240"
      :breakpoint="900"
      dark
      class="pawcontrol-sidebar"
    >
      <!-- Logo -->
      <div class="sidebar-logo row items-center q-px-md q-py-lg no-wrap">
        <PawPrint :size="28" class="logo-icon q-mr-sm" />
        <span class="logo-text">PawControl</span>
      </div>

      <q-separator color="white" opacity="0.1" />

      <!-- Navegación -->
      <q-scroll-area class="sidebar-scroll q-mt-sm">
        <q-list padding dark>
          <template v-for="item in menuItems" :key="item.label">
            <!-- Item with children -->
            <template v-if="item.children">
              <q-item
                clickable
                class="sidebar-item"
                :class="{ 'sidebar-item--active': isExpanded(item.label) }"
                @click="toggleExpand(item.label)"
              >
                <q-item-section avatar>
                  <component :is="item.icon" :size="18" />
                </q-item-section>
                <q-item-section>{{ item.label }}</q-item-section>
                <q-item-section side>
                  <ChevronDown
                    :size="14"
                    class="expand-icon"
                    :class="{ 'expand-icon--open': isExpanded(item.label) }"
                  />
                </q-item-section>
              </q-item>
              <q-slide-transition>
                <div v-show="isExpanded(item.label)">
                  <q-item
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    clickable
                    class="sidebar-item sidebar-item--child"
                    active-class="sidebar-item--active"
                  >
                    <q-item-section avatar>
                      <ChevronRight :size="14" class="opacity-50" />
                    </q-item-section>
                    <q-item-section>{{ child.label }}</q-item-section>
                  </q-item>
                </div>
              </q-slide-transition>
            </template>

            <!-- Simple item -->
            <q-item
              v-else
              :to="item.to"
              clickable
              class="sidebar-item"
              active-class="sidebar-item--active"
            >
              <q-item-section avatar>
                <component :is="item.icon" :size="18" />
              </q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>

      <!-- Logout -->
      <div class="sidebar-footer q-pa-md">
        <q-separator color="white" opacity="0.1" class="q-mb-md" />
        <q-item clickable class="sidebar-item rounded-borders" @click="logout">
          <q-item-section avatar>
            <LogOut :size="18" />
          </q-item-section>
          <q-item-section>Cerrar sesión</q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <!-- ─── Header ─────────────────────────────────────────── -->
    <q-header class="pawcontrol-header" elevated>
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          class="text-grey-7 q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <Menu :size="20" />
        </q-btn>

        <q-space />

        <!-- Notification bell -->
        <q-btn flat round dense class="text-grey-7 q-mr-xs">
          <Bell :size="20" />
          <q-badge color="negative" floating rounded>1</q-badge>
        </q-btn>

        <!-- User name + Avatar -->
        <div class="row items-center no-wrap q-ml-sm">
          <span v-if="authStore.user" class="text-caption text-grey-7 q-mr-xs">
            {{ authStore.user.name }}
          </span>
          <q-avatar size="34px" color="primary" text-color="white" class="cursor-pointer">
            <User :size="18" />
            <q-tooltip>{{ authStore.user?.name ?? 'Mi cuenta' }}</q-tooltip>
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <!-- ─── Page ───────────────────────────────────────────── -->
    <q-page-container class="pawcontrol-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* ── Sidebar ─────────────────────────── */
.pawcontrol-sidebar {
  background-color: #1b0f42 !important;
}

:deep(.q-drawer) {
  background-color: #1b0f42 !important;
}

:deep(.q-item) {
  color: rgba(255, 255, 255, 0.75) !important;
  border-radius: 8px;
  margin: 2px 8px;
  min-height: 40px;
  transition: background 0.15s;
}

:deep(.q-item:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
}

:deep(.q-item__label) {
  color: inherit;
}

:deep(.q-item__section--avatar) {
  color: inherit;
  min-width: 36px;
}

.sidebar-logo {
  height: 64px;
}

.logo-icon {
  color: #a78bfa;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.sidebar-scroll {
  height: calc(100% - 64px - 80px);
}

.sidebar-item {
  color: rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  margin: 2px 8px;
  min-height: 40px;
  transition: background 0.15s;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.sidebar-item--active,
:deep(.q-router-link--active) {
  background: rgba(124, 58, 237, 0.45) !important;
  color: #ffffff !important;
}

.sidebar-item--child {
  padding-left: 8px;
}

.expand-icon {
  transition: transform 0.2s;
  opacity: 0.6;
}

.expand-icon--open {
  transform: rotate(180deg);
}

.sidebar-footer {
  position: sticky;
  bottom: 0;
  background-color: #1b0f42;
}

/* ── Header ──────────────────────────── */
.pawcontrol-header {
  background: #ffffff !important;
  color: #1a1a2e;
  border-bottom: 1px solid #e5e7eb;
}

.header-search {
  width: 260px;
  border-radius: 8px;
}

/* ── Page background ─────────────────── */
.pawcontrol-bg {
  background-color: #f4f6f9;
}
</style>
