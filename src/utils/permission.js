import { useUserStore } from '@/stores/user'

/**
 * 检查用户是否有访问路由的权限
 * @param {Object} route - 路由对象
 * @returns {boolean} 是否有权限
 */
export function hasPermission(route) {
  const userStore = useUserStore()
  
  // 如果路由不需要认证，直接返回true
  if (!route.meta?.requestAuth) {
    return true
  }
  
  // 检查用户是否已登录
  if (!userStore.isLoggedIn) {
    return false
  }
  
  // 检查角色权限
  if (route.meta?.roles && route.meta.roles.length > 0) {
    const userRole = userStore.userInfo?.role || 'user'
    return route.meta.roles.includes(userRole)
  }
  
  return true
}

/**
 * 过滤有权限的路由
 * @param {Array} routes - 路由数组
 * @returns {Array} 过滤后的路由数组
 */
export function filterPermissionRoutes(routes) {
  return routes.filter(route => {
    if (hasPermission(route)) {
      if (route.children) {
        route.children = filterPermissionRoutes(route.children)
      }
      return true
    }
    return false
  })
}

/**
 * 获取用户可访问的路由
 * @param {Array} allRoutes - 所有路由
 * @returns {Array} 用户可访问的路由
 */
export function getUserAccessibleRoutes(allRoutes) {
  const userStore = useUserStore()
  
  if (!userStore.isLoggedIn) {
    // 未登录用户只能访问不需要认证的路由
    return allRoutes.filter(route => !route.meta?.requestAuth)
  }
  
  // 已登录用户根据角色过滤路由
  return filterPermissionRoutes(allRoutes)
}

/**
 * 检查用户是否有特定权限
 * @param {string} permission - 权限标识
 * @returns {boolean} 是否有权限
 */
export function hasSpecificPermission(permission) {
  const userStore = useUserStore()
  
  if (!userStore.isLoggedIn || !userStore.userInfo) {
    return false
  }
  
  const userPermissions = userStore.userInfo.permissions || []
  return userPermissions.includes(permission)
}

/**
 * 获取用户角色
 * @returns {string} 用户角色
 */
export function getUserRole() {
  const userStore = useUserStore()
  return userStore.userInfo?.role || 'guest'
}

/**
 * 检查是否为管理员
 * @returns {boolean} 是否为管理员
 */
export function isAdmin() {
  return getUserRole() === 'admin'
}

/**
 * 检查是否为普通用户
 * @returns {boolean} 是否为普通用户
 */
export function isUser() {
  const role = getUserRole()
  return role === 'user' || role === 'admin'
} 