<?php
/**
 * Business Pro Theme
 *
 * This file adds the front page to the Business Pro Theme.
 *
 * @package   BusinessProTheme
 * @link      https://seothemes.com/themes/business-pro
 * @author    SEO Themes
 * @copyright Copyright © 2017 SEO Themes
 * @license   GPL-2.0+
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {

	die;

}
wp_enqueue_style( 'bootstrapin', '/static/bootstrap-3.3.4/dist/css/bootstrap.css' );
wp_enqueue_style( 'bootthemin', '/static/bootstrap-3.3.4/dist/css/bootstrap-theme.css' );
wp_enqueue_style(  'actionstyles', get_stylesheet_directory_uri() . '/assets/css/actionair.css' );


// // Enqueue theme scripts.
wp_enqueue_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js');
// // Enqueue miranda.js
wp_enqueue_script( 'bootstrap', '/static/bootstrap-3.3.4/dist/js/bootstrap.js' );
wp_enqueue_script( 'bootstrap-cookie', get_stylesheet_directory_uri() . '/assets/scripts/jquery.cookie.js' );
wp_enqueue_script( 'jqui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js' );
wp_enqueue_script( 'greatcirc', get_stylesheet_directory_uri() . '/assets/scripts/great_circle.js' );
// // Enqueue map api scripts.


wp_enqueue_style( 'typehead', get_stylesheet_directory_uri() . '/assets/css/typehead.css');
// // Enqueue typehead.js.
wp_enqueue_script( 'type-head-bundle-js', get_stylesheet_directory_uri() . '/assets/scripts/typeahead.bundle.js' );
//
// // Enqueue available-airports-fees.js
wp_enqueue_script( 'airport-fees-js', get_stylesheet_directory_uri() . '/assets/scripts/available-airports-fees.js' );
//
//
// // Enqueue miranda.js
wp_enqueue_script( 'miranda-js', get_stylesheet_directory_uri() . '/assets/scripts/miranda.js' );


wp_enqueue_script( 'googlemapsapi', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBCzyxbiDIthWXfxdk88zrlvqEHPOrxgkU&callback=initMap' );
// Check if any front page widgets are active.
if ( is_active_sidebar( 'front-page-1' ) ||
	is_active_sidebar( 'front-page-2' ) ||
	is_active_sidebar( 'front-page-3' ) ||
	is_active_sidebar( 'front-page-4' ) ||
	is_active_sidebar( 'front-page-5' ) ||
	is_active_sidebar( 'front-page-6' ) ) {

	// Force full-width-content layout.
	add_filter( 'genesis_pre_get_option_site_layout', '__genesis_return_full_width_content' );

	// Remove default page header.
	remove_action( 'genesis_before_content_sidebar_wrap', 'business_page_header' );

	// Remove content-sidebar-wrap.
	add_filter( 'genesis_markup_content-sidebar-wrap', '__return_null' );

	// Remove default loop.
	remove_action( 'genesis_loop', 'genesis_do_loop' );
	add_action( 'genesis_loop', 'business_front_page_loop' );

	/**
	 * Front page content.
	 *
	 * @since  1.0.5
	 *
	 * @return void
	 */
	function business_front_page_loop() {

		// Get custom header markup.
		ob_start();
		the_custom_header_markup();
		$custom_header = ob_get_clean();

		// Display Front Page 1 widget area.
		genesis_widget_area( 'front-page-1', array(
			'before' => '<div class="front-page-1 page-header" role="banner" ' . business_custom_header() . '>' . $custom_header . '<div class="wrap">',
			'after'  => '</div></div>',
		) );

		// Front page 2 widget area.
		genesis_widget_area( 'front-page-2', array(
			'before' => '<div class="front-page-2 widget-area">',
			'after'  => '</div>',
		) );

		// Front page 3 widget area.
		genesis_widget_area( 'front-page-3', array(
			'before' => '<div class="front-page-3 widget-area"><div class="wrap">',
			'after'  => '</div></div>',
		) );

		// Front page 4 widget area.
		genesis_widget_area( 'front-page-4', array(
			'before' => '<div class="front-page-4 widget-area"><div class="wrap">',
			'after'  => '</div></div>',
		) );

		// Front page 5 widget area.
		genesis_widget_area( 'front-page-5', array(
			'before' => '<div class="front-page-5 widget-area"><div class="wrap">',
			'after'  => '</div></div>',
		) );

		// Front page 6 widget area.
		genesis_widget_area( 'front-page-6', array(
			'before' => '<div class="front-page-6 widget-area"><div class="wrap">',
			'after'  => '</div></div>',
		) );
	}
}
// Run Genesis.
genesis();
