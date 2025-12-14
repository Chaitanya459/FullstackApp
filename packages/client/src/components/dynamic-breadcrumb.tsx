import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import routes from '@/routes';

interface BreadcrumbSegment {
  href?: string;
  name: string;
  path: string;
}

const DynamicBreadcrumb: React.FC = () => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const pathSegments = location.pathname.split(`/`).filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    // Always add home as the first breadcrumb
    breadcrumbs.push({
      href: `/`,
      name: `Home`,
      path: `/`,
    });

    // If we're on the home page, just return home
    if (location.pathname === `/`) {
      return breadcrumbs;
    }

    // Build cumulative paths and find matching routes
    let currentPath = ``;

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Try to find a matching route
      const matchingRoute = routes.find((route) => {
        // Exact match
        if (route.path === currentPath) {
          return true;
        }

        // Parameter route match (e.g., /users/:id matches /users/123)
        if (route.path !== `*` && route.path.includes(`:`)) {
          const routeSegments = route.path.split(`/`).filter(Boolean);
          const currentSegments = currentPath.split(`/`).filter(Boolean);

          if (routeSegments.length === currentSegments.length) {
            return routeSegments.every((routeSegment, i) =>
              routeSegment.startsWith(`:`) || routeSegment === currentSegments[i]);
          }
        }

        return false;
      });

      if (matchingRoute) {
        breadcrumbs.push({
          href: index === pathSegments.length - 1 ? undefined : currentPath, // Last item has no href
          name: matchingRoute.name,
          path: currentPath,
        });
      } else {
        // If no matching route, create a breadcrumb with a formatted segment name
        const formattedName = segment
          .split(`-`)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(` `);

        breadcrumbs.push({
          href: index === pathSegments.length - 1 ? undefined : currentPath,
          name: formattedName,
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs if there's only the home item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return <Breadcrumb>
    <BreadcrumbList>
      {breadcrumbs.map((crumb, index) =>
        <React.Fragment key={crumb.path}>
          <BreadcrumbItem className={index === 0 ? `hidden md:block` : ``}>
            {crumb.href ?
              <BreadcrumbLink asChild>
                <Link to={crumb.href}>{crumb.name}</Link>
              </BreadcrumbLink> :
              <BreadcrumbPage>{crumb.name}</BreadcrumbPage>}
          </BreadcrumbItem>
          {index < breadcrumbs.length - 1 &&
            <BreadcrumbSeparator className={index === 0 ? `hidden md:block` : ``} />}
        </React.Fragment>)}
    </BreadcrumbList>
  </Breadcrumb>;
};

export default DynamicBreadcrumb;
