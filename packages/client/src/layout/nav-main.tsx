import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { INavGroup } from './navigation-items';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar-provider';
import { useAbility } from '@/contexts/AbilityContext';

export const NavMain = ({ groups }: { groups: INavGroup[] }) => {
  const ability = useAbility();

  return groups.map((group) => {
    if (group.permission && ability.cannot(group.permission.action, group.permission.subject)) {
      return null;
    }

    return <SidebarGroup key={group.name}>
      {group.name && <SidebarGroupLabel>{group.name}</SidebarGroupLabel>}
      <SidebarMenu>
        {group.items.map((item) => {
          if (item.permission && ability.cannot(item.permission.action, item.permission.subject)) {
            return null;
          }

          return item.items?.length ?
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.label}>
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) =>
                      <SidebarMenuSubItem key={subItem.label}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.path}>
                            <span>{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>)}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible> :
            <SidebarMenuItem key={item.label}>
              <Link to={item.path}>
                <SidebarMenuButton className="cursor-pointer" tooltip={item.label}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>;
        })}
      </SidebarMenu>
    </SidebarGroup>;
  });
};
