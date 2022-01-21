<template>
    <div class="w-full flex max-w-4xl sm:px-6 lg:px-8">
      <div class="w-full mt-4 bg-white overflow-hidden border sm:rounded-sm p-4">
        <h2 class="text-xl leading-4">
            <slot name="title"></slot>
        </h2>
        <p class="mt-3 text-gray-600">
            <slot name="content"></slot>
        </p>
        </div>
    </div>
</template>