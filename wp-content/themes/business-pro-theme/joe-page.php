<?php
/**
 * Business Pro Theme
 *
 * This file adds the landing page template to the Business Pro Theme.
 *
 * Template Name: joe Page
 *
 * @package Business Pro
 * @author  SEOThemes
 * @license GPL-2.0+
 * @link    https://seothemes.com/themes/business-pro
 */

// // If this file is called directly, abort.
// if ( ! defined( 'WPINC' ) ) {
//
// 	die;
//
// }
//
// add_filter( 'body_class', 'business_landing_page_body_class' );
// /**
//  * Add landing page body class.
//  *
//  * @since  1.0.0
//  *
//  * @param  array $classes Array of body classes.
//  * @return array $classes Array of body classes.
//  */
// function business_landing_page_body_class( $classes ) {
//
// 	$classes[] = 'landing-page';
//
// 	return $classes;
//
// }
//
// remove_action( 'genesis_before_header', 'genesis_skip_links', 5 );
// add_action( 'wp_enqueue_scripts', 'business_dequeue_skip_links' );
// /**
//  * Dequeue skip links script.
//  *
//  * @since  1.0.0
//  *
//  * @return void
//  */
// function business_dequeue_skip_links() {
//
// 	wp_dequeue_script( 'skip-links' );
//
// }
//
// // Remove site header elements.
// // remove_action( 'genesis_header', 'genesis_header_markup_open', 5 );
// // remove_action( 'genesis_header', 'genesis_do_header' );
// // remove_action( 'genesis_header', 'genesis_header_markup_close', 15 );
//
// // Remove default page header.
// // remove_action( 'genesis_after_header', 'business_page_header_open', 20 );
// // remove_action( 'genesis_after_header', 'business_page_header_title', 24 );
// // remove_action( 'genesis_after_header', 'business_page_header_close', 28 );
//
// // Add title back (removed in /includes/header.php).
// add_action( 'genesis_entry_header', 'genesis_do_post_title' );
//
// // Remove navigation.
// // remove_theme_support( 'genesis-menus' );
//
// // Remove breadcrumbs.
// remove_action( 'genesis_before_loop', 'genesis_do_breadcrumbs' );
//
// // Remove footer widgets.
// remove_action( 'genesis_footer', 'genesis_footer_widget_areas', 6 );
// remove_action( 'genesis_footer', 'business_before_footer_widget_area', 5 );
//
// // Remove site footer elements.
// remove_action( 'genesis_footer', 'genesis_footer_markup_open', 5 );
// remove_action( 'genesis_footer', 'genesis_do_footer' );
// remove_action( 'genesis_footer', 'business_footer_menu', 7 );
// remove_action( 'genesis_footer', 'genesis_footer_markup_close', 15 );

add_action('genesis_before_entry','joes_content');
function joes_content(){
	 get_template_part('templates/joes-include');
}
//    <link rel="stylesheet" href="/static/bootstrap-3.3.4-dist/css/bootstrap.css">
    // <link rel="stylesheet" href="/static/bootstrap-3.3.4-dist/css/bootstrap-theme.css">
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
// Run the Genesis loop.
genesis();
