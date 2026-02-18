"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VisuallyHidden,
} from "@js-ds-ui/components";

function DemoStack({ children }: { children: React.ReactNode }) {
  return <div className="docs-demo-grid">{children}</div>;
}

function ToastDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Changes are now live.</ToastDescription>
        <ToastAction altText="Undo action">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export const componentDemos: Record<string, React.ReactNode> = {
  accordion: (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is js-ds-ui?</AccordionTrigger>
        <AccordionContent>A theme-first, density-aware design system.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Why OKLCH?</AccordionTrigger>
        <AccordionContent>Perceptual contrast across themes.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  "aspect-ratio": (
    <AspectRatio ratio={16 / 9} className="rounded-lg bg-[var(--color-background-secondary)]">
      <div className="h-full w-full grid place-items-center text-sm text-[var(--color-text-secondary)]">
        16:9 media
      </div>
    </AspectRatio>
  ),
  avatar: (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=68" alt="Avatar" />
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  ),
  button: (
    <DemoStack>
      <div className="flex gap-3 flex-wrap">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
    </DemoStack>
  ),
  checkbox: (
    <div className="flex items-center gap-3">
      <Checkbox id="newsletter" defaultChecked />
      <Label htmlFor="newsletter">Subscribe to updates</Label>
    </div>
  ),
  collapsible: (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 text-sm text-[var(--color-text-secondary)]">
        Collapsible content goes here.
      </CollapsibleContent>
    </Collapsible>
  ),
  "context-menu": (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-md border border-[var(--color-border-default)] px-4 py-2 text-sm">
        Right click me
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem>Archive</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  dialog: (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team</DialogTitle>
          <DialogDescription>Send an invite with a prefilled role.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-2">
          <Input placeholder="name@example.com" />
          <Button>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
  "dropdown-menu": (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  "hover-card": (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm">Hover content preview.</div>
      </HoverCardContent>
    </HoverCard>
  ),
  input: (
    <DemoStack>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </DemoStack>
  ),
  label: (
    <div className="flex items-center gap-3">
      <Label htmlFor="inline-field">Label</Label>
      <Input id="inline-field" placeholder="Inline input" />
    </div>
  ),
  menubar: (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  "navigation-menu": (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Overview</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 text-sm">
            Quick links to core docs.
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-3 py-2 text-sm">
            Tokens
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  popover: (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">
        Popover content for quick hints.
      </PopoverContent>
    </Popover>
  ),
  progress: <Progress value={60} />,
  "radio-group": (
    <RadioGroup defaultValue="default" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  ),
  "scroll-area": (
    <ScrollArea className="h-32 w-full rounded-md border border-[var(--color-border-default)] p-3">
      <div className="space-y-2 text-sm">
        <div>Scrollable content line 1</div>
        <div>Scrollable content line 2</div>
        <div>Scrollable content line 3</div>
        <div>Scrollable content line 4</div>
        <div>Scrollable content line 5</div>
      </div>
    </ScrollArea>
  ),
  select: (
    <Select defaultValue="default">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick density" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="compact">Compact</SelectItem>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="comfortable">Comfortable</SelectItem>
      </SelectContent>
    </Select>
  ),
  separator: <Separator />,
  sheet: (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust the workspace configuration.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  slider: <Slider defaultValue={[60]} max={100} step={1} />,
  switch: (
    <div className="flex items-center gap-3">
      <Switch id="alerts" defaultChecked />
      <Label htmlFor="alerts">Enable alerts</Label>
    </div>
  ),
  tabs: (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-[var(--color-text-secondary)]">
        Use Tabs for dense content.
      </TabsContent>
      <TabsContent value="tokens" className="text-sm text-[var(--color-text-secondary)]">
        Token definitions and examples.
      </TabsContent>
    </Tabs>
  ),
  toast: <ToastDemo />,
  "toggle-group": (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
  toolbar: (
    <Toolbar>
      <ToolbarButton className="px-3 text-sm">Bold</ToolbarButton>
      <ToolbarButton className="px-3 text-sm">Italic</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton className="px-3 text-sm">Link</ToolbarButton>
    </Toolbar>
  ),
  tooltip: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip info</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  "visually-hidden": (
    <div className="text-sm">
      Screen reader text
      <VisuallyHidden>Extra hidden context for assistive tech.</VisuallyHidden>
    </div>
  ),
};
